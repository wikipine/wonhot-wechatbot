/*
 Navicat Premium Data Transfer

 Source Server         : 127.0.0.1
 Source Server Type    : MySQL
 Source Server Version : 50732
 Source Host           : localhost:3306
 Source Schema         : wonhot

 Target Server Type    : MySQL
 Target Server Version : 50732
 File Encoding         : 65001

 Date: 16/07/2024 16:19:58
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for bot_list
-- ----------------------------
DROP TABLE IF EXISTS `bot_list`;
CREATE TABLE `bot_list` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '机器人ID',
  `alias` varchar(64) DEFAULT NULL COMMENT '别名',
  `type` int(3) unsigned DEFAULT '0' COMMENT '机器人类型',
  `status` int(3) unsigned DEFAULT '0' COMMENT '状态',
  `heartbeat_at` timestamp NULL DEFAULT NULL COMMENT '最近存活时间',
  `last_at` timestamp NULL DEFAULT NULL COMMENT '上次登录时间',
  `last_out_at` timestamp NULL DEFAULT NULL COMMENT '上次登出时间',
  `created_at` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1004 DEFAULT CHARSET=utf8mb4 COMMENT='机器人列表';

-- ----------------------------
-- Table structure for bot_message
-- ----------------------------
DROP TABLE IF EXISTS `bot_message`;
CREATE TABLE `bot_message` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `bot_id` int(10) unsigned NOT NULL COMMENT '机器人ID',
  `talker_id` varchar(255) NOT NULL COMMENT '发送者ID',
  `talker_name` varchar(64) DEFAULT NULL COMMENT '发送者名称',
  `talker_avatar` longtext COMMENT '发送者头像',
  `talker_gender` tinyint(1) unsigned zerofill DEFAULT NULL COMMENT '发送者性别',
  `talker_alias` varchar(64) DEFAULT NULL COMMENT '发送者备注',
  `listener_id` varchar(255) DEFAULT NULL COMMENT '接收者ID',
  `listener_name` varchar(64) DEFAULT NULL COMMENT '接受者名称',
  `listener_avatar` longtext COMMENT '接受者头像',
  `listener_alias` varchar(64) DEFAULT NULL COMMENT '接受者备注',
  `listener_gender` tinyint(1) DEFAULT NULL COMMENT '接受者性别',
  `room_id` varchar(255) DEFAULT NULL COMMENT '群id',
  `room_name` varchar(64) DEFAULT NULL COMMENT '群名称',
  `room_avatar` longtext COMMENT '群头像',
  `message_id` varchar(255) DEFAULT NULL COMMENT '消息id',
  `message_type` tinyint(3) NOT NULL COMMENT '消息类型',
  `message_content` longtext COMMENT '消息内容',
  `message_at` datetime DEFAULT NULL COMMENT '消息时间',
  `created_at` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COMMENT='消息记录';

-- ----------------------------
-- Table structure for bot_rule_reply
-- ----------------------------
DROP TABLE IF EXISTS `bot_rule_reply`;
CREATE TABLE `bot_rule_reply` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `chat_name` varchar(255) DEFAULT NULL COMMENT '聊天室名称',
  `chat_type` int(3) unsigned NOT NULL DEFAULT '0' COMMENT '聊天室类型',
  `keyword` varchar(255) NOT NULL COMMENT '触发关键词',
  `reply_type` int(3) unsigned NOT NULL DEFAULT '0' COMMENT '回复类型',
  `reply_content` text COMMENT '回复内容',
  `used_num` int(10) unsigned DEFAULT '0' COMMENT '被使用过次数',
  `created_at` timestamp NULL DEFAULT NULL COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COMMENT='消息回复配置规则';

SET FOREIGN_KEY_CHECKS = 1;
